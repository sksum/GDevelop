// @flow
import * as React from 'react';
import { type Resource } from '../../Utils/GDevelopServices/Asset';
import ButtonBase from '@material-ui/core/ButtonBase';
import Text from '../../UI/Text';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';
import VideoLibrary from '@material-ui/icons/VideoLibrary';
import FontDownload from '@material-ui/icons/FontDownload';
import RaisedButton from '../../UI/RaisedButton';
import { Trans } from '@lingui/macro';
import { Column, Line } from '../../UI/Grid';
import { CorsAwareImage } from '../../UI/CorsAwareImage';

const paddingSize = 10;
const styles = {
  previewBackground: {
    background: 'url("res/transparentback.png") repeat',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    objectFit: 'contain',
    verticalAlign: 'middle',
    pointerEvents: 'none',
  },
  cardContainer: {
    overflow: 'hidden',
    position: 'relative',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 48,
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    backgroundColor: 'rgb(0,0,0,0.5)',
  },
  title: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  icon: { width: 32, height: 32 },
  audioElement: { width: 128, height: 40 },
};

type ImageCardProps = {|
  size: number,
  resource: Resource,
  onChoose: () => void,
|};

const ImageCard = ({ resource, onChoose, size }: ImageCardProps) => {
  return (
    <ButtonBase onClick={onChoose} focusRipple>
      <div style={{ ...styles.cardContainer, width: size, height: size }}>
        <div style={{ ...styles.previewBackground, width: size, height: size }}>
          <CorsAwareImage
            key={resource.url}
            style={{
              ...styles.previewImage,
              maxWidth: 128 - 2 * paddingSize,
              maxHeight: 128 - 2 * paddingSize,
            }}
            src={resource.url}
            alt={resource.name}
          />
        </div>
        <div style={styles.titleContainer}>
          <Text noMargin style={styles.title}>
            {resource.name}
          </Text>
          <Text noMargin style={styles.title} size="body2">
            {resource.license}
          </Text>
        </div>
      </div>
    </ButtonBase>
  );
};

type GenericCardProps = {|
  size: number,
  resource: Resource,
  onChoose: () => void,
  children: React.Node,
|};

const GenericCard = ({
  resource,
  onChoose,
  size,
  children,
}: GenericCardProps) => {
  return (
    <div style={{ ...styles.cardContainer, width: size, height: size }}>
      <Column>{children}</Column>
      <div style={styles.titleContainer}>
        <Text noMargin style={styles.title}>
          {resource.name}
        </Text>
        <Text noMargin style={styles.title} size="body2">
          {resource.license}
        </Text>
      </div>
    </div>
  );
};

type Props = {|
  size: number,
  resource: Resource,
  onChoose: () => void,
|};

export const ResourceCard = ({ resource, onChoose, size }: Props) => {
  const resourceKind = resource.type;

  switch (resourceKind) {
    case 'image':
      return <ImageCard resource={resource} onChoose={onChoose} size={size} />;
    case 'audio':
      return (
        <GenericCard onChoose={onChoose} resource={resource} size={size}>
          <Line justifyContent="center">
            <audio controls src={resource.url} style={styles.audioElement}>
              Audio preview is unsupported.
            </audio>
          </Line>
          <Line justifyContent="center">
            <RaisedButton onClick={onChoose} label={<Trans>Choose</Trans>} />
          </Line>
        </GenericCard>
      );
    case 'json':
      return (
        <GenericCard onChoose={onChoose} resource={resource} size={size}>
          <Line justifyContent="center">
            <InsertDriveFile style={styles.icon} />
          </Line>
          <Line justifyContent="center">
            <RaisedButton onClick={onChoose} label={<Trans>Choose</Trans>} />
          </Line>
        </GenericCard>
      );
    case 'video':
      return (
        <GenericCard onChoose={onChoose} resource={resource} size={size}>
          <Line justifyContent="center">
            <VideoLibrary style={styles.icon} />
          </Line>
          <Line justifyContent="center">
            <RaisedButton onClick={onChoose} label={<Trans>Choose</Trans>} />
          </Line>
        </GenericCard>
      );
    case 'font':
      return (
        <GenericCard onChoose={onChoose} resource={resource} size={size}>
          <Line justifyContent="center">
            <FontDownload style={styles.icon} />
          </Line>
          <Line justifyContent="center">
            <RaisedButton onClick={onChoose} label={<Trans>Choose</Trans>} />
          </Line>
        </GenericCard>
      );
    default:
      return null;
  }
};
