using System;

namespace apiPtoVtaWeb.Model
{
    public class Folio
    {
        public int Periodo { get; set; }
        public int Empresa { get; set; }
        public string Tipo { get; set; }
        public int Numero { get; set; }
        public string? Fecha { get; set; }
        public string? Glosa { get; set; }
        public int Rut { get; set; }
        public string? DV { get; set; }
        public string? Nombre { get; set; }
        public int Cuenta { get; set; }
        public int NoDoc { get; set; }
        public int NoDocL { get; set; }
        public string? Vencim { get; set; }
        public int Valor { get; set; }
        public int Cruzado { get; set; }
        public int AlPortador { get; set; }
        public int AlaOrden { get; set; }
        public string? MesCrito { get; set; }
        public string? MesCrito2 { get; set; }
        public double Debe { get; set; }
        public double Haber { get; set; }
        public int Anulado { get; set; }
        public string? Usuario { get; set; }
        public string? FechaReg { get; set; }
        public int Referencia { get; set; } // Primary Key
        public int Norma { get; set; }
        public int Local { get; set; }
        public string? TipoCentro { get; set; }
    }
}