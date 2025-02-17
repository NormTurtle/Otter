'use client';

import { usePathname } from 'next/navigation';

import { useSidebar } from '../hooks/useSidebar';
import { Flex } from './Flex';
import { Link, LinkProps } from './Link';
import { Text } from './Text';

type SidebarLinkProps = LinkProps & {
  count?: number;
  activePath?: string;
};
export const SidebarLink = ({
  count,
  href,
  children,
  activePath,
  ...rest
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (activePath ? pathname.includes(activePath) : false);

  const { handleCloseSidebar } = useSidebar();

  return (
    <Link
      href={href}
      variant="sidebar"
      {...rest}
      isActive={isActive}
      onClick={handleCloseSidebar}
    >
      <Flex display="inline" gapX="xs" align="center">
        {children}
      </Flex>
      {count ? <Text variant="count">{count}</Text> : null}
    </Link>
  );
};
