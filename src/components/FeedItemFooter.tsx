import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/Tooltip';
import { MINIMUM_CLICK_COUNT } from '@/src/constants';
import {
  Calendar,
  NavigationArrow,
  RssSimple,
  Star,
} from '@phosphor-icons/react';
import urlJoin from 'proper-url-join';
import { Suspense } from 'react';
import title from 'title';

import { useClickBookmark } from '../hooks/useClickBookmark';
import { Bookmark } from '../types/db';
import { getRelativeDate } from '../utils/dates';
import { fullPath } from '../utils/fullPath';
import { simpleUrl } from '../utils/simpleUrl';
import { createBrowserClient } from '../utils/supabase/client';
import { Favicon } from './Favicon';
import { FeedItemActions } from './FeedItemActions';
import { Flex } from './Flex';
import { IconButton } from './IconButton';
import { Link } from './Link';
import { Paragraph } from './Paragraph';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { RssFeed } from './RssFeed';
import { TypeToIcon } from './TypeToIcon';

export interface FeedItemFooterProps extends Bookmark {
  allowDeletion?: boolean;
  id: string;
  isInFeed?: boolean;
}

export const FeedItemFooter = (props: FeedItemFooterProps) => {
  const supabaseClient = createBrowserClient();
  const {
    url,
    tags,
    created_at,
    modified_at,
    id,
    star,
    type,
    click_count,
    isInFeed,
    feed,
  } = props;
  const handleClickRegister = useClickBookmark();
  const createdDate = getRelativeDate(created_at);
  const modifiedDate = getRelativeDate(modified_at);
  const dateTooltip =
    created_at !== modified_at
      ? `Created on ${createdDate.formatted}, modified on ${modifiedDate.formatted}`
      : `Created on ${createdDate.formatted}`;

  const handleToggleStar = async (): Promise<void> => {
    await supabaseClient
      .from('bookmarks')
      .update({
        star: !star,
        // @ts-ignore
        modified_at: new Date(),
      })
      .match({ id });
  };

  return (
    <TooltipProvider delayDuration={800} skipDelayDuration={500}>
      <div className="grid gap-1 text-step--2">
        <Flex align="center" gapX="m" wrap="wrap">
          {tags?.length ? (
            <Flex align="center" gap="xs">
              <ul className="m-0 flex list-none flex-wrap gap-3xs p-0">
                {tags.map((tag) => (
                  <li id={tag} key={tag}>
                    <Link href={urlJoin('/tag', tag)} variant="tag">
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            </Flex>
          ) : null}
        </Flex>
        <Flex justify="between" gap="3xs" wrap="wrap">
          <Flex align="center" gapX="2xs" gapY="2xs" wrap="wrap">
            {url ? (
              <>
                <Favicon url={url} />
                <Link
                  rel="external"
                  href={url}
                  onClick={() => handleClickRegister(id)}
                >
                  {simpleUrl(url)}
                </Link>
              </>
            ) : null}

            <Tooltip>
              <TooltipTrigger asChild>
                {star ? (
                  <IconButton onClick={handleToggleStar} size="s">
                    <Star size={16} weight="fill" />
                  </IconButton>
                ) : (
                  <IconButton onClick={handleToggleStar} size="s">
                    <Star size={16} weight="duotone" />
                  </IconButton>
                )}
              </TooltipTrigger>
              <TooltipContent>Star/unstar this item</TooltipContent>
            </Tooltip>

            {type !== null ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Flex align="center">
                    <Link href={urlJoin('/type', type)}>
                      <TypeToIcon type={type} size="16" />
                    </Link>
                  </Flex>
                </TooltipTrigger>
                <TooltipContent>Type: {title(type)}</TooltipContent>
              </Tooltip>
            ) : null}

            {click_count >= MINIMUM_CLICK_COUNT ? (
              <Tooltip>
                <TooltipTrigger>
                  <Flex align="center" gap="3xs">
                    <NavigationArrow weight="duotone" size="16" />
                    {click_count}
                  </Flex>
                </TooltipTrigger>
                <TooltipContent>Click count</TooltipContent>
              </Tooltip>
            ) : null}

            {createdDate.formatted ? (
              <Tooltip>
                <TooltipTrigger>
                  <Flex align="center" gap="3xs">
                    <Calendar weight="duotone" size="16" className="shrink-0" />
                    <time dateTime={created_at}>
                      {createdDate.ago < 8
                        ? createdDate.relative
                        : createdDate.formatted}
                    </time>
                  </Flex>
                </TooltipTrigger>
                <TooltipContent>{dateTooltip}</TooltipContent>
              </Tooltip>
            ) : null}

            {feed && url ? (
              <Popover>
                <PopoverTrigger asChild>
                  <IconButton size="m">
                    <RssSimple
                      aria-label="View latest RSS feed items"
                      size={18}
                      weight="duotone"
                    />
                  </IconButton>
                </PopoverTrigger>
                <PopoverContent>
                  <Suspense fallback={<Paragraph>Loading...</Paragraph>}>
                    <RssFeed feedUrl={fullPath(url, feed)} />
                  </Suspense>
                </PopoverContent>
              </Popover>
            ) : null}
          </Flex>

          <FeedItemActions
            {...props}
            key={`actions-${id}`}
            isInFeed={isInFeed}
          />
        </Flex>
      </div>
    </TooltipProvider>
  );
};
