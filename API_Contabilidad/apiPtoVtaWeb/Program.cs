using apiPtoVtaWeb.Data;
using apiPtoVtaWeb.Data.Repositories;
using apiPtoVtaWeb.Data.Repositories.Interface;
using apiPtoVtaWeb.Data.Repositories.Interfaces;
using apiPtoVtaWeb.Data.Services;
using apiPtoVtaWeb.Data.Services.Interfaces;
using apiPtoVtaWeb.Model;
using apiPtoVtaWeb.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using MySql.Data.MySqlClient;
using apiPtoVtaWeb.Data.Helpers;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.SetIsOriginAllowed(origin => true) // Permitir cualquier origen
               .AllowAnyMethod()
               .AllowAnyHeader()
               .Build();
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "Demo API", Version = "v1" });
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = TokenJwtHelper.GetTokenParameters();
    });

string connectionString = builder.Configuration.GetConnectionString("MySqlConnection");
builder.Services.AddSingleton(new DatabaseConnectionManager(connectionString));
builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<ITenantRegistry, TenantRegistry>();
builder.Services.AddScoped<ITenantResolver, TenantResolver>();
builder.Services.AddScoped<InventoryDbContext>();

builder.Services.AddScoped<IEmpresaRepository, EmpresaRepository>();
builder.Services.AddScoped<ICodigosCPRepository, CodigosCPRepository>();
builder.Services.AddScoped<IIFRSRepository, IFRSRepository>();
builder.Services.AddScoped<ICodigoFinancieroRepository, CodigoFinancieroRepository>();
builder.Services.AddScoped<IGlosaRepository, GlosaRepository>();
builder.Services.AddScoped<IGruposRepository, GrupoRepository>();
builder.Services.AddScoped<ITipoDocumentoRepository, TipoDocumentoRepository>();
builder.Services.AddScoped<ICuentasRepository, CuentasRepository>();
builder.Services.AddScoped<IObrasRepository, ObrasRepository>();
builder.Services.AddScoped<IFlujosRepository, FlujosRepository>();
builder.Services.AddScoped<ISucursalesRepository, SucursalesRepository>();
builder.Services.AddScoped<IProyectosRepository, ProyectosRepository>();
builder.Services.AddScoped<INombresRepository, NombresRepository>();
builder.Services.AddScoped<IBancosRepository, BancosRepository>();
builder.Services.AddScoped<IItemesRepository, ItemesRepository>();
builder.Services.AddScoped<IUsuariosRepository, UsuariosRepository>();
builder.Services.AddScoped<IAuthenticationUserService, AuthenticationUserService>();
builder.Services.AddScoped<IPermisosRepository, PermisosRepository>();
builder.Services.AddScoped<ILineasRepository, LineasRepository>();
builder.Services.AddScoped<IFoliosRepository, FoliosRepository>();
builder.Services.AddScoped<ILibroDiarioRepository, LibroDiarioRepository>();
builder.Services.AddScoped<ILibroMayorRepository, LibroMayorRepository>();
builder.Services.AddScoped<ISaldosMensualesCuentaRepository, SaldosMensualesCuentaRepository>();
builder.Services.AddScoped<ILibroInventarioBalanceRepository, LibroInventarioBalanceRepository>();
builder.Services.AddScoped<ILibroMayorEsquematicoRepository, LibroEsquematicoRepository>();
builder.Services.AddScoped<IBalance8ColumnasRepository, Balance8ColumnasRepository>();
builder.Services.AddScoped<ICentroRepository, CentroRepository>();
var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI();
//}

//app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
