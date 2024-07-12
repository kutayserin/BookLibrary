import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';

export function CustomIcon({ style,name,...rest }: IconProps<ComponentProps<typeof Ionicons>['name']>) {
  return <Ionicons size={30} style={[{ marginBottom: -3 }, style]} {...rest} name={name}/>;
}