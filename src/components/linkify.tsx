import Link from "next/link";
import type React from "react";
import { LinkIt, LinkItUrl } from "react-linkify-it";
import { UserLinkWithTooltip } from "./user-link-with-tooltip";

interface LinkifyProps {
  children: React.ReactNode;
}

const hashtagRegex = /(#[a-zA-Z0-9]+)/;
const usernameRegex = /(@[a-zA-Z0-9_-]+)/;

export const Linkify = ({ children }: LinkifyProps) => {
  return (
    <LinkifyUsername>
      <LinkifyHashtag>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashtag>
    </LinkifyUsername>
  );
};

function LinkifyUrl({ children }: LinkifyProps) {
  return (
    <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
  );
}
function LinkifyUsername({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={usernameRegex}
      component={(match, key) => (
        <UserLinkWithTooltip key={key} username={match.slice(1)}>
          {match}
        </UserLinkWithTooltip>
      )}
    >
      {children}
    </LinkIt>
  );
}
function LinkifyHashtag({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={hashtagRegex}
      component={(match, key) => (
        <Link
          key={key}
          href={`/hashtag/${match.slice(1)}`}
          className="text-primary hover:underline"
        >
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  );
}
