using System;

namespace apiPtoVtaWeb.Model
{
    public class Linea
    {
        public int Periodo { get; set; }
        public int Empresa { get; set; }
        public string Tipo { get; set; }
        public int Numero { get; set; }
        public string? Fecha { get; set; }
        public int Cuenta { get; set; }
        public int Obra { get; set; }
        public int Item { get; set; }
        public int Partida { get; set; }
        public int Auxiliar { get; set; }
        public int Td { get; set; }
        public long NoDoc { get; set; }
        public int NoDocL { get; set; }
        public string? FeDoc { get; set; }
        public string? FeVen { get; set; }
        public int Debe { get; set; }
        public int Haber { get; set; }
        public string? Glosa { get; set; }
        public int Flujo { get; set; }
        public string? Usuario { get; set; }
        public string? FechaReg { get; set; }
        public int Referencia { get; set; } // Primary Key
        public int Norma { get; set; }
        public int Rut2 { get; set; }
        public int Proyecto { get; set; }
        public string? DV { get; set; }
        public int Fuente { get; set; }
        public int PPTC { get; set; }
        public string? PPTCAsig { get; set; }
        public int CodigoCP { get; set; }
        public string? NroRef { get; set; }

        public string? Type { get; set; }
    }
}