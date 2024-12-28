
import bcrypt from "bcrypt";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};



export function shouldShowNavbar(pathname: string): boolean {
  
  const isAuthPageWithoutRole =
    pathname.startsWith('/auth') &&
    !pathname.includes('/auth/user') &&
    !pathname.includes('/auth/tutor');

  const is404Page = pathname === '/404';

  
  return !(isAuthPageWithoutRole || is404Page);
}



export async function fetchCourseDetails(courseId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${courseId}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to fetch course details for ID: ${courseId}`);
    return response.json();
  } catch (error) {
    console.error(`Error fetching course details for ID ${courseId}:`, error);
    return null;
  }
}


export function validateYouTubePlaylistLink(link: string): string {
  const regex = /^https:\/\/www\.youtube\.com\/playlist\?list=[a-zA-Z0-9_-]+$/;

  if (!regex.test(link)) {
    throw new Error("Invalid playlist link format. Link must be in the form: https://www.youtube.com/playlist?list=PLAYLIST_ID");
  }

  
  const playlistId = new URLSearchParams(new URL(link).search).get("list");
  if (!playlistId) {
    throw new Error("Missing playlist ID in the link.");
  }

  return playlistId;
}





export async function fetchPlaylistDetails(playlistId: string, apiKey: string) {
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`);
    if (!response.ok) throw new Error("Failed to fetch playlist details");
    const data = await response.json();
    return data.items[0]?.snippet;
  } catch (error) {
    console.error("Error fetching playlist details:", error);
    return null;
  }
}


export async function fetchPlaylistVideos(playlistId: string, apiKey: string) {
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`);
    if (!response.ok) throw new Error("Failed to fetch playlist videos");
    const data = await response.json();
    return data.items.map((item) => ({
      videoId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
    }));
  } catch (error) {
    console.error("Error fetching playlist videos:", error);
    return [];
  }
}








export async function fetchYouTubePlaylist(playlistLink: string) {
  const playlistId = validateYouTubePlaylistLink(playlistLink);

  if (!playlistId) {
    throw new Error("Invalid YouTube playlist link");
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch YouTube playlist data");
  }

  const data = await response.json();
  return data.items.map((item) => ({
    videoId: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.medium.url,
  }));
}

