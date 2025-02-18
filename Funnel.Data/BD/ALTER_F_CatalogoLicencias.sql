USE [SFS-MASTER-QA]
GO
/****** Object:  StoredProcedure [dbo].[F_CatalogoLicencias]    Script Date: 18/02/2025 11:47:57 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ulises Mireles Cruz
-- Create date: 2021-04-19
-- Description:	Consultas de empresas de Tenant
-- =============================================
ALTER PROCEDURE [dbo].[F_CatalogoLicencias] 
  @pBandera varchar(50) = null,
  @pIdLicencia int = 0,
  @pNombreLicencia varchar(100) = null,
  @pCantidadUsuarios int = 0,
  @pCantidadOportunidades int = 0,
  @pIdUsuarioCreador int = 0,
  @pActivo int=0
  
AS
BEGIN

	IF @pBandera = 'SEL-LICENCIAS'
	BEGIN
		SELECT IdLicencia, NombreLicencia, CantidadUsuarios, CantidadOportunidades, Activo
		FROM Licencias
	END

	IF @pBandera = 'INS-LICENCIA'
	BEGIN
		INSERT INTO Licencias (NombreLicencia, CantidadUsuarios, CantidadOportunidades,UsuarioCreador, FechacReacion,Activo) VALUES
							 (@pNombreLicencia, @pCantidadUsuarios, @pCantidadOportunidades, @pIdUsuarioCreador, GETDATE(),1)
		

	END

	IF @pBandera = 'UPD-LICENCIA'
	BEGIN
		UPDATE Licencias SET 
			NombreLicencia = @pNombreLicencia,
			CantidadUsuarios = @pCantidadUsuarios,
			CantidadOportunidades = @pCantidadOportunidades,
			FechaModificacion = GETDATE(),
			Activo=@pActivo
		WHERE IdLicencia = @pIdLicencia

	END

	

END
