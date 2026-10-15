import React, { useState } from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../lib/constants';

const { width } = Dimensions.get('window');

interface ImageCarouselProps {
  images: string[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };

  if (!images || images.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      >
        {images.map((img, idx) => (
          <Image key={idx} source={{ uri: img }} style={styles.image} />
        ))}
      </ScrollView>
      {images.length > 1 && (
        <View style={styles.dotsContainer}>
          {images.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                activeIndex === idx && styles.activeDot
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    backgroundColor: COLORS.border,
  },
  image: {
    width,
    height: 300,
    resizeMode: 'cover',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 16,
    width: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.surface,
  }
});
