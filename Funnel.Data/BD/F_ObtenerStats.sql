USE [SFS-MASTER-QA]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =======================================================================================================
-- Author:		Misael Hernandez Villarreal
-- Create date: 2025-02-19
-- Description:	Obtiene toda la informacion de Stats relacionadas a Usuarios y Oportunidades por empresa
-- =======================================================================================================
CREATE PROCEDURE F_ObtenerStats
AS
BEGIN
	SET NOCOUNT ON;
	WITH UsuariosInfo AS (
    SELECT 
		SUM(CASE WHEN u.Estatus = 1 THEN 1 ELSE 0 END) AS UsuariosActivos,
		SUM(CASE WHEN u.Estatus = 0 THEN 1 ELSE 0 END) AS UsuariosInactivos,
		SUM(CASE WHEN u.Estatus IN (0,1) THEN 1 ELSE 0 END) AS TotalUsuarios,
        e.IdEmpresa,
        e.NombreEmpresa
    FROM Usuarios AS u
    LEFT JOIN Empresas AS e ON e.IdEmpresa = u.IdEmpresa
    WHERE e.IdEmpresa > 0
    GROUP BY e.IdEmpresa, e.NombreEmpresa
	),
	OportunidadesInfo AS (
		SELECT 
			SUM(CASE WHEN o.Estatus = 1 THEN 1 ELSE 0 END) AS OportunidadesActivas,
			SUM(CASE WHEN o.Estatus = 0 THEN 1 ELSE 0 END) AS OportunidadesInactivas,
			SUM(CASE WHEN o.Estatus IN (0,1) THEN 1 ELSE 0 END) AS TotalOportunidades,
			e.IdEmpresa
		FROM Oportunidades AS o
		LEFT JOIN Empresas AS e ON e.IdEmpresa = o.IdEmpresa
		WHERE e.IdEmpresa > 0
		GROUP BY e.IdEmpresa
	)
	SELECT 
		e.IdEmpresa,
		e.NombreEmpresa AS Empresa,
		e.Activo AS Estatus,
		CASE WHEN e.Activo = 1 THEN 'Activo' ELSE 'Inactivo' END as DesEstatus,
		u.UsuariosActivos AS UsuariosActivos,
		u.TotalUsuarios AS UsuariosRegistrados,
		o.OportunidadesActivas AS OportunidadesActivas,
		o.TotalOportunidades AS OportunidadesRegistradas
	FROM Empresas e 
	FULL JOIN UsuariosInfo u ON e.IdEmpresa = u.IdEmpresa
	FULL JOIN OportunidadesInfo o ON e.IdEmpresa = o.IdEmpresa
	ORDER BY u.NombreEmpresa
END
GO
