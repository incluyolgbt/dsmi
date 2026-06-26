import styles from './Pagination.module.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const PrevIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <title>Icono de flecha izquierda</title>
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

const NextIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <title>Icono de flecha derecha</title>
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

function getPageNumbers(
    currentPage: number,
    totalPages: number
): (number | string)[] {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [1];

    if (currentPage <= 3) {
        pages.push(2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
        pages.push(
            '...',
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages
        );
    } else {
        pages.push(
            '...',
            currentPage - 1,
            currentPage,
            currentPage + 1,
            '...',
            totalPages
        );
    }

    return pages;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const pageNumbers = getPageNumbers(currentPage, totalPages);

    return (
        <nav
            className={styles['pagination']}
            aria-label="Navegación de páginas"
            id="pagination"
        >
            <div className={styles['pagination-container']}>
                <button
                    type="button"
                    className={styles['pagination-button']}
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    aria-label="Página anterior"
                >
                    <PrevIcon />
                    <span className={styles['pagination-button-text']}>
                        Anterior
                    </span>
                </button>

                <ul className={styles['pagination-numbers']}>
                    {pageNumbers.map((page, idx) => (
                        <li key={idx}>
                            {typeof page === 'number' ? (
                                page === currentPage ? (
                                    <span
                                        className={`${styles['pagination-number']} ${styles['pagination-current']}`}
                                        aria-current="page"
                                        aria-label={`Página ${page}`}
                                    >
                                        {page}
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        className={styles['pagination-number']}
                                        onClick={() => onPageChange(page)}
                                        aria-label={`Ir a página ${page}`}
                                    >
                                        {page}
                                    </button>
                                )
                            ) : (
                                <span
                                    className={styles['pagination-ellipsis']}
                                    aria-hidden="true"
                                >
                                    {page}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>

                <button
                    type="button"
                    className={styles['pagination-button']}
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    aria-label="Página siguiente"
                >
                    <span className={styles['pagination-button-text']}>
                        Siguiente
                    </span>
                    <NextIcon />
                </button>
            </div>
        </nav>
    );
}
