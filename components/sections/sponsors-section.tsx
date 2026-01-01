export function SponsorsSection() {
  const sponsors = [
    { name: "Apple", width: 40 },
    { name: "Spotify", width: 80 },
    { name: "Amazon", width: 70 },
    { name: "YouTube", width: 90 },
  ]

  return (
    <section className="border-y bg-muted/30 py-12">
      <div className="container">
        <div className="flex items-center justify-center gap-12 lg:gap-20">
          {sponsors.map((sponsor) => (
            <div key={sponsor.name} className="text-2xl font-bold text-muted-foreground opacity-60">
              {sponsor.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
