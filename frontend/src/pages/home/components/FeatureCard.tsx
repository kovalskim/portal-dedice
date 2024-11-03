import { ReactNode } from 'react';
import { CardHeader } from '@chakra-ui/icons';
import { Card, CardBody, CardFooter, Heading } from '@chakra-ui/react';

import { Link } from '@frontend/components/links';

type FeatureCardProps = {
  heading: string;
  linkLabel: string;
  linkTo: string;
  children: ReactNode;
};

export const FeatureCard = ({
  heading,
  linkLabel,
  linkTo,
  children,
}: FeatureCardProps) => {
  return (
    <Card p={6}>
      <CardHeader>
        <Heading size="md">{heading}</Heading>
      </CardHeader>
      <CardBody pb={2}>{children}</CardBody>
      <CardFooter>
        <Link href={linkTo}>{linkLabel}</Link>
      </CardFooter>
    </Card>
  );
};
