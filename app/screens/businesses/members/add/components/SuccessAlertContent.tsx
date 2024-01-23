import { StyleSheet } from 'react-native';
import React from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';

import { Text } from '@components';
import { BaseColor } from '@config';

import { IconName } from '../../../../../contexts/alerts-v2/models/Icon';

type Props = {
  email: string;
};

export default function SuccessAlertContent({ email }: Props) {
  return (
    <>
      <IonIcon
        size={70}
        name={IconName.CheckMarkCircle}
        color={BaseColor.greenColor}
      />
      <Text textAlign="center" header>
        Invitation Sent
      </Text>
      <Text textAlign="center" body1>
        We have sent an invitation email to {email}
      </Text>
      <Text
        textAlign="center"
        body1
        bold
        style={[{ color: BaseColor.redColor }, styles.noteText]}>
        NOTE:
      </Text>
      <Text textAlign="center" body2>
        Since no account is registered with this email: {email}
      </Text>
      <Text textAlign="center" body2>
        We have sent an email to {email} for account registration.
      </Text>
      <Text textAlign="center" body2>
        Once the user registers with this email in our app, He will be
        automatically added as the member of your business
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  noteText: {
    marginTop: 10,
  },
});
