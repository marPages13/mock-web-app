import { ref, onMounted, onUnmounted, type Ref } from 'vue';

export function useIntersectionObserver(
  callback: () => void,
  options?: IntersectionObserverInit,
) {
  const target = ref<HTMLElement | null>(null);
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        callback();
      }
    }, options);

    if (target.value) {
      observer.observe(target.value);
    }
  });

  onUnmounted(() => {
    observer?.disconnect();
  });

  return { target: target as Ref<HTMLElement | null> };
}
