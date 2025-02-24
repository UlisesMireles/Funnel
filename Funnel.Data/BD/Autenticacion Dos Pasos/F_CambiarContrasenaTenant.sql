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
-- Description:	Cambiar contraseña del usuario administrador de Tenant
-- =============================================
CREATE PROCEDURE [dbo].[F_CambiarContrasenaTenant] 	
(
	@pUsuario		VarChar(20),
	@pPass			Varchar(200)
)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @Result					Bit;
	DECLARE @ErrorMessage			Varchar(MAX);	
	BEGIN TRAN;

	BEGIN TRY  						

		IF EXISTS(SELECT [Usuario] FROM [dbo].[AdministradorEmpresas] WHERE [Usuario] = @pUsuario)
			BEGIN
				UPDATE [dbo].[AdministradorEmpresas]
				SET	[Clave] = @pPass
				WHERE 
					[Usuario] = @pUsuario;

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