import { ImageIcon } from 'lucide-react';
import Image from 'next/image';

export const Attachments = () => {
  const images = ['/images/placeholder.jpg', '/images/placeholder.jpg'];
  return (
    <div className="space-y-4">
      <h3 className="flex items-center text-lg font-medium">
        <ImageIcon className="mr-2 h-5 w-5" /> Attachments ({images.length})
      </h3>

      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className="border rounded-md overflow-hidden">
              <Image
                src={image || ''}
                alt={`Attachment ${index + 1}`}
                className="w-full h-auto"
                width={100}
                height={100}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-muted-foreground">No attachments found.</p>
        </div>
      )}
    </div>
  );
};
