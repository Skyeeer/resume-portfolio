import Link from "next/link";
import {
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt
} from "react-icons/fa";

export function ContactInfo() {
    return (
        <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                Get In Touch
            </h2>

            <div className="grid md:grid-cols-2 gap-8 items-stretch">
                <div className="bg-card rounded-lg p-8 shadow-lg border border-border h-full">
                    <h3 className="text-2xl font-semibold mb-6 text-card-foreground">Contact Information</h3>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-secondary text-secondary-foreground">
                                <FaEnvelope size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <Link href="mailto:charlie.alander@gmail.com" className="text-foreground hover:text-primary transition-colors">
                                    charlie.alander@gmail.com
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-primary text-primary-foreground">
                                <FaPhone size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Phone</p>
                                <Link href="tel:+46768560210" className="text-foreground hover:text-primary transition-colors">
                                    +46 76 856 02 10
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-accent text-accent-foreground">
                                <FaMapMarkerAlt size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Location</p>
                                <p className="text-foreground">Stockholm, Sweden</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-lg shadow-lg border border-border overflow-hidden h-full flex">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d130832.93951310929!2d17.877599477670953!3d59.326241205623495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f763119640bcb%3A0xa80d27d3679d7766!2sStockholm%2C%20Sweden!5e0!3m2!1sen!2sus!4v1697062143331!5m2!1sen!2sus"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full"
                        title="Stockholm Map">
                    </iframe>
                </div>
            </div>
        </div>
    );
} 