ALTER TABLE [dbo].[Usuarios]
ADD CodigoAutenticacion VARCHAR(200) NULL,
	FechaInicio DATETIME NULL,
	FechaFin DATETIME NULL;
GO

DECLARE @NumeroDesde	Int = 100000;
DECLARE @NumeroHasta	Int = 999999;	

UPDATE [dbo].[Usuarios]
SET CodigoAutenticacion = ROUND(((@NumeroHasta - @NumeroDesde) * RAND() + @NumeroDesde), 0),
	FechaInicio = GETDATE(),
	[FechaFin] = DATEADD(MINUTE, 2, GETDATE());
GO

select * from Usuarios WHERE Usuario = 'admin.eisei'

UPDATE Usuarios SET CorreoElectronico = 'ulises.mireles' WHERE Usuario = 'admin.eisei'
