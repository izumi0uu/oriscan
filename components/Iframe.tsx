const Iframe = ({ src }: { src: string }) => {
  return (
    <iframe
      src={src}
      className="w-full h-full border-none aspect-square"
      loading="lazy"
      sandbox="allow-scripts"
      scrolling="no"
    />
  )
}

export default Iframe
