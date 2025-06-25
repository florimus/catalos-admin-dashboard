'use client';

import { useCallback, useEffect, useState } from 'react';
import { validatePermissions } from './roleValidations';

const SecureComponent = ({
  permission,
  children,
}: {
  permission?: string;
  children: React.ReactNode;
}) => {
  const [hasRole, setHasRole] = useState<boolean>(false);
  const checkRole = useCallback(() => {
    if (!permission) {
      setHasRole(true);
    } else {
      validatePermissions(permission, true).then((res) => {
        setHasRole(res);
      });
    }
  }, [permission]);

  useEffect(() => {
    checkRole();
  }, [checkRole]);
  return hasRole ? <>{children}</> : <></>;
};

export default SecureComponent;
