import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface AVPURadioGroupProps {
value?: string;
onChange: (value: string) => void;
disabled?: boolean;
}

const AVPURadioGroup: React.FC<AVPURadioGroupProps> = ({ 
value, 
onChange, 
disabled = false 
}) => {
const options = [
    { value: 'A', label: 'Alert' },
    { value: 'V', label: 'Voice' },
    { value: 'P', label: 'Pain' },
    { value: 'U', label: 'Unresponsive' }
];

return (
    <div className="space-y-2">
    <h5 className="font-bold">AVPU</h5>
    <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        disabled={disabled}
    >
        {options.map(option => (
        <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`avpu-${option.value}`} />
            <Label htmlFor={`avpu-${option.value}`}>{option.label}</Label>
        </div>
        ))}
    </RadioGroup>
    </div>
);
};

export default AVPURadioGroup;