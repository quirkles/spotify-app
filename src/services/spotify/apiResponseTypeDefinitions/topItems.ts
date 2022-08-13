export interface TopArtist {
  external_urls: {
    spotify: string;
  };
  followers: { href: string | null; total: number };
  genres: string[];
  href: string;
  id: string;
  images: [
    {
      height: number;
      url: string;
      width: number;
    }
  ];
  name: string;
  popularity: number;
  type: "artist";
  uri: string;
}

export interface TopArtistResponse {
  items: TopArtist[];
  total: number;
  limit: number;
  offset: number;
  href: string | null;
  previous: string | null;
  next: string | null;
}
