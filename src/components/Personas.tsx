import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const personas = [
  {
    name: "Emily",
    type: "Individual",
    description: "Share and consume food and reduce food waste.",
    traits: [
      "Values sustainability",
      "Focuses on minimizing food waste",
      "Prefers simple user experience",
      "Regular food sharer"
    ]
  },
  {
    name: "Green Bites",
    type: "Organizations",
    description: "Eco-conscious companies willing to share excess food.",
    traits: [
      "Handles large food volumes",
      "Requires scheduling features",
      "Seeks to reduce food waste",
      "Collaborates with charities"
    ]
  },
  {
    name: "Helping Hands",
    type: "Charity Organizations",
    description: "Handle bulk food collections and distributions.",
    traits: [
      "Manages large-scale food distribution",
      "Needs scheduling and reporting tools",
      "Focuses on community impact",
      "Works with donors and volunteers"
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
