using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apiPtoVtaWeb.Model.QueryData
{
    public class SaldoMensualesCuenta
    {
        public int Grupo { get; set; }
        public string NGrupo { get; set; }
        public int Cuenta { get; set; }
        public string NCuenta { get; set; }
        public long Saldo01 { get; set; }
        public long Saldo02 { get; set; }
        public long Saldo03 { get; set; }
        public long Saldo04 { get; set; }
        public long Saldo05 { get; set; }
        public long Saldo06 { get; set; }
        public long Saldo07 { get; set; }
        public long Saldo08 { get; set; }
        public long Saldo09 { get; set; }
        public long Saldo10 { get; set; }
        public long Saldo11 { get; set; }
        public long Saldo12 { get; set; }
        public long SaldoTotal { get; set; }

        public SaldoMensualesCuenta()
        {
            Saldo01 = 0;
            Saldo02 = 0;
            Saldo03 = 0;
            Saldo04 = 0;
            Saldo05 = 0;
            Saldo06 = 0;
            Saldo07 = 0;
            Saldo08 = 0;
            Saldo09 = 0;
            Saldo10 = 0;
            Saldo11 = 0;
            Saldo12 = 0;
            SaldoTotal = 0;
        }
    }
}