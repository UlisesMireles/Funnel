USE [SFS-MASTER-QA]
GO
/****** Object:  Table [dbo].[VersionesTenant]    Script Date: 18/02/2025 10:28:41 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VersionesTenant](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[VersionAplicacion] [varchar](20) NULL,
	[VersionNet] [varchar](20) NULL,
	[VersionAngular] [varchar](20) NULL,
	[FechaRegistro] [datetime] NULL,
	[Estatus] [bit] NULL,
 CONSTRAINT [PK_VersionesTenant] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[VersionesTenant] ON 
GO
INSERT [dbo].[VersionesTenant] ([Id], [VersionAplicacion], [VersionNet], [VersionAngular], [FechaRegistro], [Estatus]) VALUES (1, N'1', N'9', N'19', CAST(N'2025-02-17T17:27:00.487' AS DateTime), 1)
GO
SET IDENTITY_INSERT [dbo].[VersionesTenant] OFF
GO
