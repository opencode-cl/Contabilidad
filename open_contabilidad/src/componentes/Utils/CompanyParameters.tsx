"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import secureLocalStorage from 'react-secure-storage';
import { SESSION_NAMES } from '@/variablesglobales';

interface CompanyParamsProps {
  children: React.ReactNode;
}

const CompanyParams: React.FC<CompanyParamsProps> = ({ children }) => {
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {

      const empresaId = secureLocalStorage.getItem(SESSION_NAMES.EMPRESA_ID);
      const empresaName = secureLocalStorage.getItem(SESSION_NAMES.EMPRESA_NAME);
      const periodo = secureLocalStorage.getItem(SESSION_NAMES.PERIODO_YEAR);
      const month = secureLocalStorage.getItem(SESSION_NAMES.PERIODO_MONTH);

    console.log(empresaId, empresaName, periodo, month);

    if (!empresaId || !empresaName || !periodo || !month) {
      router.push('/dashboard/configuracion/parametros');
    }
  }, [path]);

  return <>{children}</>;
};

export default CompanyParams;