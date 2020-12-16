import React from 'react';
import { useSelector } from 'react-redux';
import { Alert as AlertCUI, AlertIcon } from '@chakra-ui/react';

const Alert = () => {
  const alerts = useSelector((state) => state.alert);

  return (
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map((alert) => (
      <AlertCUI status={alert.alertType} key={alert.id}>
        <AlertIcon />
        {alert.msg}
      </AlertCUI>
    ))
  );
};

export default Alert;
