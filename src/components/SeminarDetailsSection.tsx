import React from "react";
import { Calendar, Clock, FileText } from "lucide-react";

const SeminarDetailsSection: React.FC = () => {
  return (
    <section id="seminar-details" className="py-16 md:py-24 bg-muted/50">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Seminar Details</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join us for this groundbreaking academic exploration of numerical patterns
            and mathematical harmony within the Holy Quran.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Subthemes (Full-Width on Top with Two Columns Inside) */}
          <div className="bg-card rounded-xl shadow-md p-6 border border-border hover:border-seminar-gold transition-colors col-span-full">
            <div className="flex items-center mb-4">
              <div className="h-10 w-15 rounded-full bg-seminar-blue/10 flex items-center justify-center text-seminar-blue dark:text-seminar-gold">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold ml-3">Subthemes</h3>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
              <li>• Historical Perspectives on Numerical Analysis of the Quran</li>
              <li>• The Role of Mathematics in Classical and Modern Quranic Interpretation</li>
              <li>• Patterns and Frequencies of Words and Numbers in the Quran</li>
              <li>• Criticism and Debates on Numerical Miracles in the Quran</li>
              <li>• Comparative Study: Numerical Miracles in Other Religious Texts</li>
              <li>• Scientific and Mathematical Symmetry in the Quran</li>
              <li>• The Role of Digital Tools in Analyzing Quranic Numbers</li>
              <li>• Numerical Structure of Quranic Chapters and Verses</li>
              <li>• Connection Between Numerical Miracles and Linguistic Miracles</li>
              <li>• Impact of Mathematical Interpretation on Quranic Exegesis (Tafsir)</li>
              <li>• The Quran and the Golden Ratio: Myth or Reality?</li>
              <li>• Numerical Miracles and the Concept of Divine Precision in Islam</li>
            </ul>
          </div>

          {/* Remaining Cards in 3-Column Layout */}
          <div className="bg-card rounded-xl shadow-md p-6 border border-border hover:border-seminar-gold transition-colors">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-seminar-blue/10 flex items-center justify-center text-seminar-blue dark:text-seminar-gold">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold ml-3">Submission Guidelines</h3>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Abstract:  200 to 300 words</li>
              <li>• Full Paper: 4000 to 6000 words</li>
              <li>• Reference style: APA format</li>
              <li>• Languages:  English or Malayalam</li>
              <li>• Font style:  English Times new Roman (12 pt)
                <br />
                Malayalam ML-TTKarthika (14 pt)</li>
            </ul>
          </div>

          <div className="bg-card rounded-xl shadow-md p-6 border border-border hover:border-seminar-gold transition-colors">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-seminar-blue/10 flex items-center justify-center text-seminar-blue dark:text-seminar-gold">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold ml-3">Important Dates</h3>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Abstract
                Submission
                Deadline: March 21, 2025</li>
              <li>• Abstract Acceptance : February 1, 2025</li>
              <li>• Abstract
                Acceptance Notification : March 24, 2025</li>
              <li>• Full PaperSubmission Deadline : April 08, 2025</li>
              <li>• Dateof the Seminar : April 10, 2025</li>
            </ul>
          </div>

          <div className="bg-card rounded-xl shadow-md p-6 border border-border hover:border-seminar-gold transition-colors">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-seminar-blue/10 flex items-center justify-center text-seminar-blue dark:text-seminar-gold">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold ml-3">Venue & Schedule</h3>
            </div>
            <div className=" text-muted-foreground">
              <p><strong>Location:</strong> Akode Islamic Centre</p>
              <p><strong>Date:</strong> April 10, 2025</p>
              <p><strong>Time:</strong> 9:00 AM - 5:00 PM</p>
              <p className="mt-2"><strong>Keynote Speaker:</strong></p>
              <p>Prof. Jamal Abdul Rahman, Director of Center for Quranic Studies</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeminarDetailsSection;
