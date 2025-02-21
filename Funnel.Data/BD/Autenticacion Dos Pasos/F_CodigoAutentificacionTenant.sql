USE [SFS-MASTER-QA]
GO
/****** Object:  StoredProcedure [dbo].[F_CodigoAutentificacion]    Script Date: 20/02/2025 01:09:32 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Misael Hernandez Villarreal
-- Create date: 17-12-2024
-- Description:	Verifica el código de autentificación y si sigue vigente 
-- =============================================
CREATE PROCEDURE [dbo].[F_CodigoAutentificacionTenant] 
(	
	@pUsuario		VarChar(20),
	@pCodigo		int
)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @Result			Bit;
	DECLARE @ErrorMessage	Varchar(MAX);	
	DECLARE @TipoMensaje	Int;
	BEGIN TRAN;

	BEGIN TRY  
		
		DECLARE @Activo					BIT;
		DECLARE @CodigoAutentificacion	INT;
		DECLARE @Correo					VARCHAR(100);
		DECLARE	@TiempoInicio			DATETIME;
		DECLARE	@TiempoFin				DATETIME;	

		IF EXISTS(SELECT [Usuario] FROM [dbo].[AdministradorEmpresas] WHERE [Usuario] = @pUsuario AND [CodigoAutenticacion] = @pCodigo)
			BEGIN

				SELECT 
					@TiempoInicio = [FechaInicio]
					,@TiempoFin = [FechaFin]
				FROM 
					[dbo].[AdministradorEmpresas] 
				WHERE 
					[Usuario] = @pUsuario;
				
				SET @Activo = (SELECT
					CASE 
						WHEN @TiempoInicio IS NULL AND @TiempoFin IS NULL THEN 1
						WHEN GETDATE() >= @TiempoInicio AND GETDATE() >= @TiempoFin  THEN 1					  
						ELSE 0
					END);

				IF(@Activo = 0)
					BEGIN

						SET @Result = 1;				
						SET @ErrorMessage = 'Código Correcto.';
						SET @TipoMensaje = 1;

					END					
				ELSE
					BEGIN

						SET @Result = 0;				
						SET @ErrorMessage = 'Código Caducado.';
						SET @TipoMensaje = 2;
					END

			END
		ELSE
			BEGIN
			
				SET @ErrorMessage = 'Código incorrecto.';
				SET @Result = 0;	
				SET @TipoMensaje = 3;

			END	
		
		COMMIT TRAN;
	END TRY  
	BEGIN CATCH  
		SET @Result = 0;
		SET @ErrorMessage = 'Error ' + ERROR_MESSAGE();
		ROLLBACK TRAN;
	END CATCH;

	SELECT @Result AS Result, @ErrorMessage AS ErrorMessage, @TipoMensaje AS TipoMensaje
END