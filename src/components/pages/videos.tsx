import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, User, ExternalLink } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  duration: string;
  doctor: string;
  thumbnail?: string;
}

const ExpertVideosWidget = () => {
  // Sample expert videos data
  const videos: Video[] = [
    {
      id: '1',
      title: 'Prenatal Care Essentials',
      description: 'Complete guide to prenatal care during pregnancy',
      url: 'https://www.youtube.com/watch?v=WQuX_Yw3yIg',
      category: 'Prenatal Care',
      duration: '',
      doctor: ''
    },
    {
      id: '2',
      title: 'Breastfeeding Best Practices',
      description: 'Expert tips for successful breastfeeding',
      url: 'https://www.youtube.com/watch?v=eMmQ5fCIYJQ&t=49s',
      category: 'Breastfeeding',
      duration: '',
      doctor: ''
    },
    {
      id: '3',
      title: 'Labor and Delivery Preparation',
      description: 'What to expect during labor and delivery',
      url: 'https://www.youtube.com/watch?v=fFcdff9SPUQ',
      category: 'Labor',
      duration: '15:20',
      doctor: 'Dr. Emily Chen'
    }
  ];

  const handlePlayVideo = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5 text-primary" />
          Expert Videos
        </CardTitle>
        <CardDescription>
          Educational content for maternal health
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {videos.map((video) => (
            <div key={video.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">{video.title}</h3>
                  <p className="text-sm text-muted-foreground">{video.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {video.doctor}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {video.duration}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {video.category}
                    </Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handlePlayVideo(video.url)}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Watch
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertVideosWidget;