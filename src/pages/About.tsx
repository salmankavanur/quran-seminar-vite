import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">About Us</h1>
      
      <div className="grid gap-8">
        {/* About the Seminar */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-primary">About the Seminar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              National Seminar on Numerical Inimitability in the Holy Quran - Evidence of
              Divine Precision is a one-day seminar organized by Akode Islamic Centre
              under the QLF Project. This seminar aims to explore the profound numerical
              patterns in the Quran, highlighting their role as evidence of divine precision
              and authenticity. Bringing together scholars, researchers, and academicians, it will serve as a platform for deep discussions on the intricate mathematical coherence within the Quran. The program will feature keynote lectures, panel discussions, research paper presentations, and interactive sessions, fostering scholarly engagement and knowledge exchange. By examining these numerical aspects, the seminar seeks to uncover new insights,
              identify research gaps, and encourage further studies, contributing to the
              broader discourse on the miraculous nature of the Quran.
            </p>
          </CardContent>
        </Card>

        {/* About the QLF */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-primary">About the QLF</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              QLF (Qur'anic Learning Festival) is a unique initiative by Akode Islamic
              Centre dedicated to fostering a deeper understanding and appreciation of
              the Qur'an through various academic, artistic, and interactive programs.
              Designed as a comprehensive platform, QLF brings together scholars, students, and the general public to engage with the Qur'an in innovative ways.
              The project includes diverse programs such as Qur'anic competitions,
              scholarly seminars, interactive expos, research discussions, and creative
              contests, all aimed at promoting Qur'anic literacy and scholarship. By integrating traditional and modern approaches, QLF aspires to enhance engagement with the Qur'an, inspire research, and provide a space for dialogue and learning.
            </p>
          </CardContent>
        </Card>

        {/* About the Akode Islamic Centre */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-primary">About the Akode Islamic Centre</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              The Akode Islamic Centre is a leading institution dedicated to education,
              Qur'anic studies, and social welfare. While it provides a nurturing environment for over 400 orphaned children, it also serves a broader student community, offering education from kindergarten to post-secondary levels. The
              Centre emphasizes profound Qur'anic studies alongside academic excellence. Under its administration, institutions such as the Islamic Da'wa Academy, Daiya Women's College, Oorkadave Qasim Musliyar Hifzul Qur'an College, Al-Birr Pre-School, and secondary and higher secondary schools contribute to its mission of empowering individuals through knowledge and preserving Islamic values.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About; 