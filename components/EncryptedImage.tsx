import React, { useState, useEffect, useRef } from 'react';
import { Image, ImageProps, ActivityIndicator, View, StyleSheet, Platform } from 'react-native';
import { decryptPhoto, isEncryptedFile } from '@/utils/fileEncryption';
import { colors } from '@/constants/colors';

interface EncryptedImageProps extends Omit<ImageProps, 'source'> {
  uri: string;
  fallbackUri?: string;
  onLoadStart?: () => void;
  onLoadEnd?: (success: boolean) => void;
  onDecryptionError?: (error: Error) => void;
}

export default function EncryptedImage({ 
  uri, 
  fallbackUri, 
  style, 
  onLoadStart,
  onLoadEnd,
  onDecryptionError,
  ...props 
}: EncryptedImageProps) {
  const [decryptedUri, setDecryptedUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isMounted = useRef(true);
  
  // Track temporary files to clean up
  const tempFileRef = useRef<string | null>(null);

  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
      
      // Clean up temporary file when component unmounts
      cleanupTempFile();
    };
  }, []);
  
  // Function to clean up temporary file
  const cleanupTempFile = () => {
    if (Platform.OS !== 'web' && tempFileRef.current) {
      import('expo-file-system').then(FileSystem => {
        FileSystem.deleteAsync(tempFileRef.current!, { idempotent: true })
          .catch(err => console.log('Error cleaning up temp file:', err));
        tempFileRef.current = null;
      });
    }
  };
  
  useEffect(() => {
    let isCancelled = false;
    
    const loadImage = async () => {
      // Skip decryption for web or if the file is not encrypted
      if (Platform.OS === 'web' || !isEncryptedFile(uri)) {
        if (isMounted.current && !isCancelled) {
          setDecryptedUri(uri);
        }
        return;
      }
      
      if (onLoadStart) onLoadStart();
      setIsLoading(true);
      setHasError(false);
      
      try {
        // Clean up previous temporary file if it exists
        cleanupTempFile();
        
        const decrypted = await decryptPhoto(uri);
        
        if (isMounted.current && !isCancelled) {
          // Store reference to temp file for cleanup
          tempFileRef.current = decrypted;
          setDecryptedUri(decrypted);
          setIsLoading(false);
          if (onLoadEnd) onLoadEnd(true);
        }
      } catch (error) {
        console.error('Error loading encrypted image:', error);
        if (isMounted.current && !isCancelled) {
          setHasError(true);
          setIsLoading(false);
          if (onLoadEnd) onLoadEnd(false);
          if (onDecryptionError && error instanceof Error) onDecryptionError(error);
          
          // Use fallback URI or original URI if decryption fails
          setDecryptedUri(fallbackUri || uri);
        }
      }
    };
    
    loadImage();
    
    // Cleanup function to handle component unmounting or uri changing
    return () => {
      isCancelled = true;
      cleanupTempFile();
    };
  }, [uri, onLoadStart, onLoadEnd, onDecryptionError, fallbackUri]);
  
  const handleImageError = () => {
    setHasError(true);
    if (onLoadEnd) onLoadEnd(false);
  };
  
  const handleImageLoad = () => {
    if (onLoadEnd) onLoadEnd(true);
  };
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, style]}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }
  
  if (hasError && fallbackUri) {
    return (
      <Image 
        source={{ uri: fallbackUri }} 
        style={style} 
        onError={handleImageError}
        onLoad={handleImageLoad}
        {...props} 
      />
    );
  }
  
  return decryptedUri ? (
    <Image 
      source={{ uri: decryptedUri }} 
      style={style} 
      onError={handleImageError}
      onLoad={handleImageLoad}
      {...props} 
    />
  ) : (
    <View style={[styles.errorContainer, style]} />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: colors.border,
  },
});