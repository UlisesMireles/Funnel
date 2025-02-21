USE [SFS-MASTER-QA]
GO
/****** Object:  StoredProcedure [dbo].[F_AutentificacionDosPasos]    Script Date: 20/02/2025 12:11:22 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Misael Hernández Villarreal
-- Create date: 20-02-2025
-- Description:	Autentificacion en Dos Pasos para cambio de contraseña sistema Tenant
-- =============================================
CREATE PROCEDURE [dbo].[F_CambiarContrasenaDosPasosTenant] 	
(
	@pUsuario		VarChar(20)
)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @Result					Bit;
	DECLARE @ErrorMessage			Varchar(MAX);	
	DECLARE @IdUsuario				INT;
	DECLARE @Nombre					Varchar(200);
	DECLARE @Correo					Varchar(100);
	BEGIN TRAN;

	BEGIN TRY  		
		DECLARE @Activo					Bit;
		DECLARE @CodigoAutentificacion	Int;		
		DECLARE	@TiempoInicio			DateTime;
		DECLARE	@TiempoFin				DateTime;
		DECLARE @NumeroDesde			Int = 100000;
		DECLARE @NumeroHasta			Int = 999999;					

		IF EXISTS(SELECT [Usuario] FROM [dbo].[AdministradorEmpresas] WHERE [Usuario] = @pUsuario)
			BEGIN
				SELECT 
					@Correo = [CorreoElectronico]
					,@TiempoInicio = [FechaInicio]
					,@TiempoFin = [FechaFin]
					,@Nombre = [Nombre]
					,@CodigoAutentificacion = [CodigoAutenticacion]
					,@IdUsuario = [IdAdministrador]
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

				IF(@Activo = 1)
					BEGIN
						
						SET @CodigoAutentificacion = ROUND(((@NumeroHasta - @NumeroDesde) * RAND() + @NumeroDesde), 0);

						UPDATE [dbo].[AdministradorEmpresas]
						SET 
							[CodigoAutenticacion] = @CodigoAutentificacion
							,[FechaInicio] = GETDATE()
							,[FechaFin] = DATEADD(MINUTE, 2, GETDATE())
						WHERE 
							[Usuario] = @pUsuario;	
					END					
				
				DECLARE @Body VARCHAR(MAX) = '<html><head><meta charset="UTF-8"></head><body>';
				SET @Body = @Body + '<p><span style="font-size:18px;"><strong>Hola, '
									+ @Nombre + ':&nbsp;</strong></span></p>'
									+ '<p>Para poder cambiar tu contraseña de Administrador General de Empresas, introduce este código:</p>'
									+ '<p>&nbsp;</p>'
									+ '<p style="text-align:center;"><strong style="font-size:20px;">' + CONVERT(varchar(6), @CodigoAutentificacion) + '</strong></p>'
									+ '<p>&nbsp;</p>'
									+ '<p>Este paso adicional se desencadena cuando detectemos un intento de inicio de sesión inusual.</p>'
									+ '</body></html>';


				--SELECT @Body
				EXEC msdb.dbo.sp_send_dbmail
					@profile_name='Tenant Profile',
					@recipients = @Correo,
					@body=@Body,
					@subject='Verificación Dos Pasos',
					@body_format = 'HTML';

				SET @Result = 1;				
				SET @ErrorMessage = '';

			END
		ELSE
			BEGIN

				SET @Result = 0;				
				SET @ErrorMessage = 'Ocurrio un error al cambiar la contraseña.';

			END			
		
		COMMIT TRAN;
	END TRY  
	BEGIN CATCH  
		SET @Result = 0;
		SET @ErrorMessage = 'Error ' + ERROR_MESSAGE();
		ROLLBACK TRAN;
	END CATCH;

	SELECT @Result AS Result, @ErrorMessage AS Error;
END