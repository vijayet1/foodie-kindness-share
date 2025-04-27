
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type UserType = 'home_cook' | 'student' | 'organization';

interface UserTypeSelectionProps {
  selectedType: UserType;
  onTypeSelect: (type: UserType) => void;
}

const UserTypeSelection = ({ selectedType, onTypeSelect }: UserTypeSelectionProps) => {
  return (
    <div className="w-full">
      <RadioGroup
        value={selectedType}
        onValueChange={(value) => onTypeSelect(value as UserType)}
        className="grid gap-4"
      >
        <div className={cn(
          "relative flex items-center space-x-4 rounded-lg border p-4 cursor-pointer transition-colors",
          selectedType === 'home_cook' ? "border-eco-green bg-sage-50" : "hover:bg-gray-50"
        )}>
          <RadioGroupItem value="home_cook" id="home_cook" />
          <Label htmlFor="home_cook" className="flex flex-col cursor-pointer">
            <span className="font-semibold">Home Cook</span>
            <span className="text-sm text-gray-500">Share homemade meals and reduce food waste</span>
          </Label>
        </div>

        <div className={cn(
          "relative flex items-center space-x-4 rounded-lg border p-4 cursor-pointer transition-colors",
          selectedType === 'student' ? "border-eco-green bg-sage-50" : "hover:bg-gray-50"
        )}>
          <RadioGroupItem value="student" id="student" />
          <Label htmlFor="student" className="flex flex-col cursor-pointer">
            <span className="font-semibold">Student</span>
            <span className="text-sm text-gray-500">Find affordable meals and connect with peers</span>
          </Label>
        </div>

        <div className={cn(
          "relative flex items-center space-x-4 rounded-lg border p-4 cursor-pointer transition-colors",
          selectedType === 'organization' ? "border-eco-green bg-sage-50" : "hover:bg-gray-50"
        )}>
          <RadioGroupItem value="organization" id="organization" />
          <Label htmlFor="organization" className="flex flex-col cursor-pointer">
            <span className="font-semibold">Charity Organization</span>
            <span className="text-sm text-gray-500">Handle bulk food collections and distributions</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default UserTypeSelection;
