
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const personas = [
  {
    name: "Alice",
    type: "Home Cook",
    description: "An eco-conscious individual who values safety and simplicity in food sharing.",
    traits: [
      "Values sustainability",
      "Focuses on food safety",
      "Prefers simple user experience",
      "Regular food sharer"
    ]
  },
  {
    name: "Ben",
    type: "Student",
    description: "Budget-minded student looking for convenient ready-to-pickup meals.",
    traits: [
      "Cost-conscious",
      "Seeks convenience",
      "Flexible schedule",
      "Quick response time"
    ]
  },
  {
    name: "Charity Organization",
    type: "Non-profit",
    description: "Organizations focused on bulk food collection and distribution to those in need.",
    traits: [
      "Handles large quantities",
      "Needs scheduling features",
      "Requires reporting tools",
      "Regular bulk pickups"
    ]
  }
];

const Personas = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3 p-6">
      {personas.map((persona) => (
        <Card key={persona.name} className="bg-white">
          <CardHeader>
            <CardTitle className="text-eco-green">{persona.name}</CardTitle>
            <CardDescription>{persona.type}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">{persona.description}</p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-500">
              {persona.traits.map((trait) => (
                <li key={trait}>{trait}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Personas;
