USE [SFS-MASTER-QA]
GO
/****** Object:  StoredProcedure [dbo].[F_Tenant]    Script Date: 18/02/2025 10:43:32 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Ulises Mireles Cruz
-- Create date: 2021-04-19
-- Description:	Consultas de empresas de Tenant
-- =============================================
ALTER PROCEDURE [dbo].[F_Tenant] 
  @pBandera varchar(50) = null,
  @pIdEmpresa int = 0,
  @pNombreEmpresa varchar(100) = null,
  @pIdAdministrador int = 0,
  @pIdLicencia int = 0,
  @pAlias varchar(20) = null,
  @pRFC varchar(20) = null,
  @pVInicio datetime = null,
  @pVTerminacion datetime = null,
  @pUsuarioCreador int = null,
  @pNombre varchar(100) = null,
  @pApellidoPaterno varchar(100) = null,
  @pApellidoMaterno varchar(100) = null,
  @pIniciales varchar(100) = null,
  @pCorreo varchar(100) = null,
  @pUsuario varchar(50) = null,
  @pUrlSitio varchar(500) = null,
  @pActivo INT = 0
AS
BEGIN

	IF @pBandera = 'SEL-EMPRESAS'
	BEGIN
		with user_emp as (
			select count(u.IdEmpresa) AS UserReal, e.IdEmpresa, e.NombreEmpresa from Usuarios as u
			left join Empresas as e
				on e.IdEmpresa = u.IdEmpresa
			where u.Estatus = 1 AND e.IdEmpresa > 0
			group by e.IdEmpresa, e.NombreEmpresa
		),
		oport_emp as (
			select count(o.IdEmpresa) AS OportEmp, e.IdEmpresa, e.NombreEmpresa from Oportunidades as o
			left join Empresas as e
				on e.IdEmpresa = o.IdEmpresa
			where o.Estatus = 1 AND e.IdEmpresa > 0
			group by e.IdEmpresa, e.NombreEmpresa
		),
		oport_a as (
			select count(o.IdEstatusOportunidad) as OportunidadAct,  e.IdEmpresa, e.NombreEmpresa from Oportunidades as o
			left join Empresas as e
				on e.IdEmpresa = o.IdEmpresa
			where o.Estatus = 1 AND e.IdEmpresa > 0 and o.IdEstatusOportunidad = 1
			group by e.IdEmpresa, e.NombreEmpresa
		)
		SELECT E.IdEmpresa, E.NombreEmpresa, E.Alias, E.RFC, FORMAT(E.VInicio, 'yyyy-MM-dd') AS VInicio, FORMAT(E.VTerminacion, 'yyyy-MM-dd') AS VTerminacion,
		 L.IdLicencia, L.NombreLicencia, L.CantidadUsuarios, L.CantidadOportunidades, 
		 U.IdUsuario as IdAdministrador, U.Nombre + ' ' + U.ApellidoPaterno + ' ' + U.ApellidoMaterno  as Administrador, 
		 U.Nombre, U.ApellidoPaterno, U.ApellidoMaterno,
		 U.Usuario as UsuarioAdministrador, U.CorreoElectronico as CorreoAdministrador, ue.UserReal, coalesce(oe.OportEmp, 0) as OportEmp , coalesce(oa.OportunidadAct, 0) as OportunidadAct,
		 E.Activo, UrlSitio,
		CASE WHEN E.Activo = 1 THEN 'Activo' ELSE 'Inactivo' END as DesEstatusActivo
		FROM Empresas E 
		LEFT JOIN Licencias L ON E.IdLicencia = L.IdLicencia
		LEFT JOIN Relacion_EmpresasMiembros REM ON E.IdEmpresa = REM.IdEmpresa
		LEFT JOIN Usuarios U ON REM.IdMiembro = U.IdUsuario
		LEFT JOIN user_emp as ue ON ue.IdEmpresa=E.IdEmpresa
		LEFT JOIN oport_a as oa ON oa.IdEmpresa = E.IdEmpresa
		FULL OUTER JOIN oport_emp as oe ON oe.IdEmpresa=E.IdEmpresa
	END

	IF @pBandera = 'INS-EMPRESA'
	BEGIN
		INSERT INTO Empresas (NombreEmpresa, Alias, UrlSitio, RFC, VInicio, VTerminacion, UsuarioCreador, IdLicencia,FechaCreacion)
				      VALUES (@pNombreEmpresa, @pAlias, @pUrlSitio, @pRFC, @pVInicio, @pVTerminacion, @pUsuarioCreador, @pIdLicencia, GETDATE())
		
		DECLARE @vIdEmpresa int = SCOPE_IDENTITY();

		INSERT INTO Usuarios (Nombre, ApellidoPaterno, ApellidoMaterno, Usuario, Password, Iniciales, CorreoElectronico, IdTipoUsuario, Estatus, UsuarioCreador, FechaRegistro, IdEmpresa) VALUES
							 (@pNombre, @pApellidoPaterno, @pApellidoMaterno, @pUsuario, 'PxSVyFg0W/1EYQYN1sTL6w==', @pIniciales, @pCorreo, 1, 1, @pUsuarioCreador, GETDATE(), @vIdEmpresa)
		DECLARE @vIdAdministrador int = SCOPE_IDENTITY();

	    INSERT INTO Relacion_EmpresasMiembros(IdEmpresa, IdMiembro) VALUES (@vIdEmpresa, @vIdAdministrador)
		
		INSERT INTO RolesPermisos(IdRol, IdPagina, IdEmpresa, Estatus, FechaRegistro) SELECT 1 AS IdRol, IdPagina, @vIdEmpresa AS IdEmpresa, 1 AS Estatus, GETDATE() 
			FROM Paginas ORDER BY IdPagina;

		INSERT INTO RelacionRolesEmpresa (IdEmpresa, IdRol, Estatus, FechaRegistro) SELECT @vIdEmpresa, IdTipoUsuario, 1, GETDATE()
			FROM TiposUsuarios WHERE IdTipoUsuario IN (1, 2, 3, 4);	

	END

	IF @pBandera = 'UPD-EMPRESA'
	BEGIN
		UPDATE Empresas SET 
			NombreEmpresa = @pNombreEmpresa,
			Alias = @pAlias,
			UrlSitio = @pUrlSitio,
			RFC = @pRFC,
			VInicio = @pVInicio,
			VTerminacion = @pVTerminacion,
			IdLicencia = @pIdLicencia,
			FechaModificacion = GETDATE(),
			Activo = @pActivo
		WHERE IdEmpresa = @pIdEmpresa

		UPDATE Usuarios SET CorreoElectronico = @pCorreo, 
							Nombre = @pNombre, ApellidoPaterno = @pApellidoPaterno, ApellidoMaterno = @pApellidoMaterno
							WHERE IdUsuario = @pIdAdministrador
	END

	IF @pBandera = 'SEL-ADMINISTRADORES'
	BEGIN
		SELECT IdMiembro, Nombre FROM MiembrosEmpresas 
	END

	IF @pBandera = 'SEL-LICENCIAS'
	BEGIN
		SELECT IdLicencia, NombreLicencia FROM Licencias WHERE Activo=1
	END

END


