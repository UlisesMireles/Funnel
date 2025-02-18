USE [SFS-MASTER-QA]

PRINT('F_VersionTenant')
-- =============================================
-- Author:		Misael Hernández Villarreal
-- Create date: 2025-02-17
-- Description:	Obtiene la version de la aplicacion TENANT
-- =============================================
CREATE PROCEDURE [dbo].[F_VersionTenant]
AS
BEGIN
	DECLARE @version VARCHAR(20);

	-- Obtener la última versión de cada tabla
	SELECT TOP 1 CONCAT(VersionNet,'.',VersionAngular,'.',VersionAplicacion) AS Version
	FROM VersionesTenant
	WHERE Estatus=1
	ORDER BY FechaRegistro DESC;
END;
GO

PRINT(' [dbo].[F_CatalogoSectores]')
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Eder Rivera
-- Create date: 2023-12-26
-- Description:	Consultas de sectores 
-- =============================================
ALTER PROCEDURE [dbo].[F_CatalogoSectores] 
  @pBandera varchar(50) = null,
  @pIdSector int = 0,
  @pNombreSector varchar(100) = null,
  @pDescripcionSector varchar(200) = null,
  @pIdUsuarioCreador int = 0,
  @pActivo int = 0
  
AS
BEGIN

	IF @pBandera = 'SEL-SECTORES'
	BEGIN

	SELECT 
		IdSector, 
		NombreSector, 
		DescripcionSector,
		CONVERT(varchar,S.FechaCreacion,103) AS FechaCreacion,
		UsrCre.Nombre AS UsuarioCreador, 
		CONVERT(varchar,S.FechaModificacion,103) AS FechaModificacion,
		UsrMod.Nombre AS UsuarioModifico, 
		S.Activo, CASE WHEN S.Activo = 1 THEN 'Activo' ELSE 'Inactivo' END as DesEstatusActivo
	FROM Sectores S
	LEFT  join AdministradorEmpresas UsrCre ON S.UsuarioCreador = UsrCre.IdAdministrador
	LEFT  join AdministradorEmpresas UsrMod ON S.UsuarioModifico = UsrMod.IdAdministrador 
	where NombreSector <> 'Por Asignar'
	order by NombreSector ASC;
	END

	IF @pBandera = 'INS-SECTOR'
	BEGIN
		INSERT INTO Sectores 
			(NombreSector, 
			DescripcionSector,
			UsuarioCreador, 
			FechacReacion,
			activo) 
		VALUES
			(@pNombreSector,
			 @pDescripcionSector, 
			 @pIdUsuarioCreador,
			 GETDATE(),
			 1)
	END

	IF @pBandera = 'UPD-SECTOR'
	BEGIN
		UPDATE Sectores SET 
		NombreSector = @pNombreSector,
			DescripcionSector = @pDescripcionSector,
			FechaModificacion = GETDATE(),
			UsuarioModifico = @pIdUsuarioCreador,
			Activo = @pActivo
		WHERE IdSector = @pIdSector
	END

    IF @pBandera = 'SEL-SECTORES-CMB'
	BEGIN
		SELECT IdSector AS IdSector, NombreSector AS  NombreSector, DescripcionSector AS DescripcionSector 
		FROM Sectores 
		WHERE Activo = 1 
		ORDER BY NombreSector;
	END

END
GO

PRINT(' [dbo].[Authenticate]')
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Eder Rivera
-- Create date: 2023-12-26
-- Description:	Consultas de sectores 
-- =============================================
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE [dbo].[Authenticate] 
  @pBandera varchar(50) = null,
  @Username NVarChar(255),
  @Password NVarChar(255)
AS
BEGIN
	SET NOCOUNT ON;
	IF @pBandera = 'USUARIO'
	BEGIN
		IF EXISTS( SELECT LE.IdUsuario FROM Usuarios LE INNER JOIN Empresas E ON LE.IdEmpresa = E.IdEmpresa 
		WHERE Usuario = @Username AND Password = @Password and LE.Estatus = 1 AND E.Activo = 1)
			begin
				select distinct 0, u.IdUsuario, tu.Descripcion,  E.IdEmpresa, E.ALIAS, u.IdTipoUsuario, u.Nombre
				FROM Usuarios u
				LEFT JOIN Empresas E ON u.IdEmpresa = E.IdEmpresa
				JOIN TiposUsuarios tu ON u.IdTipoUsuario = tu.IdTipoUsuario 
				WHERE Usuario = @Username AND Password = @Password --el usuario podra loguarse
			end  
		ELSE		
		if EXISTS(SELECT LE.IdUsuario FROM Usuarios LE INNER JOIN Empresas E ON LE.IdEmpresa = E.IdEmpresa  
					WHERE Usuario = @Username AND Password = @Password and LE.Estatus=0 AND E.Activo = 1) --Si el usuario esta inactivo no dejara loguearse
			SELECT 1, 0, '' --usuario desactivado
		else if EXISTS(SELECT LE.IdUsuario FROM Usuarios LE INNER JOIN Empresas E ON LE.IdEmpresa = E.IdEmpresa  
						WHERE Usuario = @Username AND Password = @Password AND E.Activo = 0) 
			SELECT 2, 0, '' --Empresa inactiva
		else
			SELECT -1, 0, '' -- El usuario no existe con ese usuario o contraseÃ±a; no dejara loguearse
	END	

	IF @pBandera = 'TENANT'
	BEGIN
		IF EXISTS( SELECT IdAdministrador FROM AdministradorEmpresas WHERE Usuario = @Username AND Clave = @Password)
			begin
				select 0, IdAdministrador as IdUsuario, 'Tenant' as Descripcion
				FROM AdministradorEmpresas
				WHERE Usuario = @Username AND Clave = @Password AND Activo = 1 --el usuario podra loguarse
			end  
		ELSE
			SELECT -1, 0, '' --usuario no existe
	END
	IF @pBandera = 'ADMINISTRADOR'
	BEGIN
		IF EXISTS( SELECT IdMiembro FROM MiembrosEmpresas WHERE Usuario = @Username AND Clave = @Password)
			begin
				select 0, M.IdMiembro as IdUsuario, 'Administrador' as Descripcion, STUFF((SELECT Convert(varchar(50),IdEmpresa) + ','
				  FROM Relacion_EmpresasMiembros 
				  WHERE IdMiembro = M.IdMiembro
				  FOR XML PATH ('')), 1, 0, '') as Empresas 
				FROM MiembrosEmpresas M
				LEFT JOIN Relacion_EmpresasMiembros R ON M.IdMiembro = R.IdMiembro
				WHERE Usuario = @Username AND Clave = @Password --el usuario podra loguarse
				GROUP BY M.IdMiembro
			end  
		ELSE
			SELECT -1, 0, '' --usuario no existe
	END
END