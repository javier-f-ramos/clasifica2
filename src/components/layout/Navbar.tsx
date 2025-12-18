
import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";
import AuthButton from "../auth/AuthButton";

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <Link href="/" className={styles.logo}>
                <Image
                    src="/logo.png"
                    alt="CLASIFICADOS Estepona Info"
                    width={200}
                    height={60}
                    style={{ objectFit: 'contain', height: '100%', width: 'auto' }}
                    priority
                />
            </Link>

            <div className={styles.navLinks}>
                <Link href="/search" className={styles.link}>
                    Explorar
                </Link>
                <Link href="/categories" className={styles.link}>
                    Categorías
                </Link>
            </div>

            <div className={styles.actions}>
                <AuthButton />
                <Link href="/publish" className={styles.ctaButton}>
                    Publicar Anuncio
                </Link>
            </div>
        </nav>
    );
}
