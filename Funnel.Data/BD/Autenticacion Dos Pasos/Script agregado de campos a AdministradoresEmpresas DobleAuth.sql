ALTER TABLE [dbo].[AdministradorEmpresas]
ADD CodigoAutenticacion VARCHAR(200) NULL,
	FechaInicio DATETIME NULL,
	FechaFin DATETIME NULL;
GO

DECLARE @NumeroDesde	Int = 100000;
DECLARE @NumeroHasta	Int = 999999;	

UPDATE [dbo].[AdministradorEmpresas]
SET CodigoAutenticacion = ROUND(((@NumeroHasta - @NumeroDesde) * RAND() + @NumeroDesde), 0),
	FechaInicio = GETDATE(),
	[FechaFin] = DATEADD(MINUTE, 2, GETDATE());
GO