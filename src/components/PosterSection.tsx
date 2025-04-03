
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const PosterSection = () => {
  // Mock poster data with descriptions added
  const posters = [
    {
      id: 1,
      title: "Moderator",
      author: "Suhail Hidaya Hudawi",
      description: "Dean, Kulliyyah of Qur'an& Sunnah",
      imageUrl: "/images/Suhail Hidaya Hudawi.jpeg",
    },
    {
      id: 2,
      title: "panelist",
      author: "Shuhaibul Haitami",
      description: "Professor of Nandhi darussalam",
      imageUrl: "/images/shuhaibul haithami.jpeg",
    },
    {
      id: 3,
      title: "panelist",
      author: "Dr. Abdul Qayoom ",
      description: "Ass. Professor PTM Govt College Perinthalmanna",
      imageUrl: "/images/Dr. Abdul Qayoom.jpeg",
    },
    {
      id: 4,
      title: "panelist",
      author: "Salam Faisy Olavattur",
      description: "Iritaq academic senate member",
      imageUrl: "/images/Salam Faisy Olavattur .jpeg",
    },
  ];

  return (
    <section className="bg-muted/30 py-16">
      <div className="section-container">
        <h2 className="text-3xl font-bold text-center mb-8">Joininng Us</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posters.map(poster => (
            <Card key={poster.id} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                <img 
                  src={poster.imageUrl} 
                  alt={poster.title} 
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg line-clamp-1">{poster.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{poster.author}</p>
                {poster.description && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{poster.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PosterSection;
