import { telHref, whatsappHref } from "@buscarepuesto/shared";

type Props = {
  phone: string;
  businessName?: string;
  partNumber?: string;
  className?: string;
};

export function ContactActions({
  phone,
  businessName,
  partNumber,
  className = "",
}: Props) {
  const waText = partNumber
    ? `Hola${businessName ? ` ${businessName}` : ""}, busco el repuesto ${partNumber}. ¿Lo tienen?`
    : undefined;

  return (
    <div className={`contact-actions ${className}`.trim()}>
      <a className="btn-call" href={telHref(phone)}>
        Llamar
      </a>
      <a
        className="btn-wa"
        href={whatsappHref(phone, waText)}
        target="_blank"
        rel="noopener noreferrer"
      >
        WhatsApp
      </a>
    </div>
  );
}
