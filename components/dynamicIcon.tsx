import * as Icons from "phosphor-react-native";

interface DynamicIconProps {
  name: any;
  size: number;
  color: string;
  weight?: "fill" | "regular" | "bold";
}

export const DynamicIcon = ({ name, size, color, weight = "fill" }: DynamicIconProps) => {  
  const Icon = Icons[name as keyof typeof Icons] as React.FC<any>;

  if (!Icon) {
    return <Icons.QuestionIcon size={size} color={color} />;
  }

  return <Icon size={size} color={color} weight={weight} />;
};