
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// This would ideally come from a database or API
const contestants = [
  {
    id: 1,
    name: "Dr. Ahmad Al-Farabi",
    institution: "International Islamic University",
    research: "Mathematical Patterns in Quranic Verses",
    image: "/images/model.jpg"
  },
  {
    id: 2,
    name: "Prof. Sarah Rahman",
    institution: "Middle East Technical University",
    research: "Numerical Symmetry in Quranic Structure",
    image: "/images/model.jpg"
  },
  {
    id: 3,
    name: "Dr. Mohammed Hassan",
    institution: "Al-Azhar University",
    research: "Digital Roots in Quranic Sequences",
    image: "/images/model.jpg"
  },
  {
    id: 4,
    name: "Dr. Layla Kareem",
    institution: "University of Jordan",
    research: "Golden Ratio in Quranic Architecture",
    image: "/images/model.jpg"
  },
  {
    id: 5,
    name: "Prof. Ibrahim Malik",
    institution: "King Fahd University",
    research: "Prime Numbers in Quranic Revelation Order",
    image: "/images/model.jpg"
  },
  {
    id: 6,
    name: "Dr. Fatima Al-Zahra",
    institution: "Qatar Foundation",
    research: "Statistical Analysis of Word Frequency",
    image: "/images/model.jpg"
  },
];

const ContestantGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contestants.map((contestant) => (
        <Card key={contestant.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="aspect-square relative overflow-hidden bg-muted">
            <img 
              src={contestant.image} 
              alt={contestant.name}
              className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
            />
          </div>
          <CardHeader>
            <CardTitle>{contestant.name}</CardTitle>
            <CardDescription>{contestant.institution}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{contestant.research}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContestantGrid;
