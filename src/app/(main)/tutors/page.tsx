"use client";

import TutorCard from '@/components/tutor/tutor-card';
import { mockTutors } from '@/lib/mock-data';
import type { Tutor } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useState, useMemo } from 'react';
import { Search, ListFilter, X, Users2 } from 'lucide-react'; // Changed Users to Users2
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AVAILABLE_SUBJECTS } from '@/lib/constants';

export default function FindTutorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('rating'); // 'rating', 'experience_desc'

  const filteredAndSortedTutors = useMemo(() => {
    let tutors = mockTutors.filter(tutor => {
      const nameMatch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase());
      const headlineMatch = tutor.headline?.toLowerCase().includes(searchTerm.toLowerCase());
      const subjectMatch = selectedSubject ? tutor.subjectMatterExpertise?.includes(selectedSubject) : true;
      const expertiseMatch = tutor.subjectMatterExpertise?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      return (nameMatch || headlineMatch || expertiseMatch) && subjectMatch;
    });

    if (sortBy === 'rating') {
      tutors.sort((a, b) => (b.overallRating || 0) - (a.overallRating || 0));
    } else if (sortBy === 'experience_desc') {
      tutors.sort((a, b) => (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0));
    }

    return tutors;
  }, [searchTerm, selectedSubject, sortBy]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Find Your Perfect Tutor</h1>
        <p className="text-lg text-gray-600">Browse our expert tutors and counselors for personalized help.</p>
      </div>

      <Card className="shadow-md">
        <CardContent className="p-4 md:p-6 space-y-4 md:space-y-0 md:flex md:flex-wrap md:items-center md:gap-4">
          <div className="relative flex-grow min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, subject, or keyword..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={selectedSubject || "all"} onValueChange={(value) => setSelectedSubject(value === "all" ? null : value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <ListFilter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {AVAILABLE_SUBJECTS.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Sort by Rating</SelectItem>
                <SelectItem value="experience_desc">Sort by Experience</SelectItem>
              </SelectContent>
            </Select>
            {(searchTerm || selectedSubject) && (
              <Button variant="ghost" onClick={() => { setSearchTerm(''); setSelectedSubject(null); }} className="text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4 mr-1" /> Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {filteredAndSortedTutors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTutors.map((tutor: Tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 shadow">
          <CardContent>
            <Users2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" /> {/* Changed Users to Users2 */}
            <h3 className="text-xl font-semibold text-foreground">No Tutors Found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
            {(searchTerm || selectedSubject) && (
                 <Button variant="link" onClick={() => { setSearchTerm(''); setSelectedSubject(null); }} className="mt-4 text-primary">
                    Clear all filters and search
                </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
