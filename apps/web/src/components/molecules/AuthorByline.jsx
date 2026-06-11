import React from "react";
import { VamiRow } from "../atoms/VamiRow";
import { VamiStack } from "../atoms/VamiStack";
import { VamiAvatar } from "../atoms/VamiAvatar";
import { VamiLink } from "../atoms/VamiLink";
import { ReadTimeDisplay } from "./ReadTimeDisplay";

/**
 * AuthorByline molecule displaying author metadata details in standard layouts.
 *
 * @param {Object} props
 * @param {Object} props.author - The author schema object
 * @param {string} props.author.username - Author username handle
 * @param {string} [props.author.displayName] - Display name
 * @param {string} [props.author.avatarUrl] - Avatar image URL
 * @param {string} props.date - Article publication date string
 * @param {number} props.readMinutes - Article reading duration in minutes
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export function AuthorByline({
  author,
  date,
  readMinutes,
  className = "",
  ...props
}) {
  const { username, displayName, avatarUrl } = author || {};
  const authorName = displayName || username || "Anonymous";

  return (
    <VamiRow
      gap={3}
      align="center"
      className={`font-ui select-none ${className}`}
      {...props}
    >
      {/* Avatar component */}
      <VamiLink to={`/users/${username}`} className="no-underline shrink-0">
        <VamiAvatar
          src={avatarUrl}
          name={authorName}
          size="sm"
          className="hover:opacity-90 transition-opacity"
        />
      </VamiLink>

      {/* Meta Text Stack */}
      <VamiStack gap={0.5} align="start" className="leading-tight">
        <VamiLink
          to={`/users/${username}`}
          className="text-xs font-bold text-ink-900 hover:text-amber-500 no-underline"
        >
          {authorName}
        </VamiLink>

        {/* Date and read time inline info */}
        <VamiRow gap={1.5} align="center" className="text-ink-400 text-xs">
          <span>{date}</span>
          <span className="text-ink-200 select-none">•</span>
          <ReadTimeDisplay minutes={readMinutes} />
        </VamiRow>
      </VamiStack>
    </VamiRow>
  );
}
