import { useState, useRef, useEffect } from 'react';
import styles from './NameCard.module.css';

export function NameCardSkeleton() {
    return (
        <article
            className={`${styles['card']} ${styles['card-skeleton']}`}
            aria-hidden="true"
        >
            <div className={styles['row-top']}>
                <div className={styles['image-container']}>
                    <div className={styles['skeleton']} />
                </div>
                <div className={styles['header']}>
                    <div
                        className={`${styles['skeleton-line']} ${styles['skeleton-name']}`}
                    />
                    <div
                        className={`${styles['skeleton-line']} ${styles['skeleton-title']}`}
                    />
                </div>
            </div>
            <div className={styles['row-info']}>
                <div
                    className={`${styles['skeleton-line']} ${styles['skeleton-city']}`}
                />
                <div
                    className={`${styles['skeleton-line']} ${styles['skeleton-pill']}`}
                />
            </div>
            <div
                className={`${styles['skeleton-line']} ${styles['skeleton-button']}`}
            />
        </article>
    );
}

const SIZES = [100, 120, 200, 240, 300, 360];

// function getImageSrcSet(image: string | null | undefined) {
//     if (!image) return '';

//     const baseUrl = new URL(image);
//     const imageName = baseUrl.pathname.split('/').pop()?.split('.').at(0);
//     const newBasePath = `${baseUrl.origin}/storage/v1/object/public/profile-pictures/responsive/${imageName}`;

//     return SIZES.map(
//         (size) => `${newBasePath}-${size}-${size}.webp ${size}w`
//     ).join(', ');
// }

interface NameCardV3Props {
    name: string;
    title: string;
    image: string | null | undefined;
    city: string;
    modalities: string[];
    profileUrl: string;
    prefetch: boolean;
}

const LocationIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#1A1A2E"
    >
        <path
            d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z"
            stroke="#1A1A2E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z"
            stroke="#1A1A2E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <title>Icono de ubicación</title>
    </svg>
);

const FALLBACK_IMAGE = 'https://saludmental.lgbt/img/profile-pictures/1.svg';

export default function NameCard({
    name,
    title,
    image,
    city,
    modalities,
    profileUrl,
    prefetch = false,
}: NameCardV3Props) {
    const imgRef = useRef<HTMLImageElement>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (imgRef.current?.complete) {
            setLoaded(true);
        }
    }, []);

    // const imageProps = prefetch
    //     ? { loading: 'eager', fetchPriority: 'high' }
    //     : {};

    return (
        <article className={styles['card']}>
            {/* Row 1: Image + Name/Title */}
            <div className={styles['row-top']}>
                <div className={styles['image-container']}>
                    <div className={styles['skeleton']} />
                    <img
                        ref={imgRef}
                        src={image || FALLBACK_IMAGE}
                        alt={
                            image
                                ? `Fotografía de ${name}`
                                : 'Fotografía genérica'
                        }
                        className={`${styles['image']} ${loaded ? styles['image-loaded'] : ''}`}
                        width={120}
                        height={120}
                        onLoad={() => setLoaded(true)}
                    />
                </div>
                <div className={styles['header']}>
                    <h2 className={styles['name']}>{name}</h2>
                    <p className={styles['title']}>{title}</p>
                </div>
            </div>

            {/* Row 2: Location + Modalities */}
            <div className={styles['row-info']}>
                <div className={styles['info-item']}>
                    <span className={styles['icon']}>
                        <LocationIcon />
                    </span>
                    <span className={styles['info-text']}>{city}</span>
                </div>

                {modalities.length > 0 && (
                    <div
                        className={`${styles['info-item']} ${styles['info-right']}`}
                    >
                        <div className={styles['modalities']}>
                            {modalities.slice(0, 2).map((modality) => (
                                <span key={modality} className={styles['pill']}>
                                    {modality}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Row 3: CTA Button */}
            <a href={profileUrl} className={styles['button']}>
                Ver perfil completo
            </a>
        </article>
    );
}
