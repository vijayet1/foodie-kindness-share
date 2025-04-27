import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type UserType = 'individual' | 'orgs' | 'charity_orgs';

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
          selectedType === 'individual' ? "border-eco-green bg-sage-50" : "hover:bg-gray-50"
        )}>
          <RadioGroupItem value="individual" id="individual" />
          <Label htmlFor="individual" className="flex flex-col cursor-pointer">
            <span className="font-semibold">Individual</span>
            <span className="text-sm text-gray-500">Share homemade meals and reduce food waste</span>
          </Label>
        </div>

        <div className={cn(
          "relative flex items-center space-x-4 rounded-lg border p-4 cursor-pointer transition-colors",
          selectedType === 'orgs' ? "border-eco-green bg-sage-50" : "hover:bg-gray-50"
        )}>
          <RadioGroupItem value="orgs" id="orgs" />
          <Label htmlFor="orgs" className="flex flex-col cursor-pointer">
            <span className="font-semibold">Organizations</span>
            <span className="text-sm text-gray-500">Find affordable meals and connect with peers</span>
          </Label>
        </div>

        <div className={cn(
          "relative flex items-center space-x-4 rounded-lg border p-4 cursor-pointer transition-colors",
          selectedType === 'charity_orgs' ? "border-eco-green bg-sage-50" : "hover:bg-gray-50"
        )}>
          <RadioGroupItem value="charity_orgs" id="charity_orgs" />
          <Label htmlFor="charity_orgs" className="flex flex-col cursor-pointer">
            <span className="font-semibold">Charity Organizations</span>
            <span className="text-sm text-gray-500">Handle bulk food collections and distributions</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default UserTypeSelection;
