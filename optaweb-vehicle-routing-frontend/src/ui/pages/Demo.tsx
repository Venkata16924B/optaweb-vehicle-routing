/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Button, Grid, GridItem, Split, SplitItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import * as React from 'react';
import { connect } from 'react-redux';
import { demoOperations } from 'store/demo';
import { routeOperations, routeSelectors } from 'store/route';
import { LatLng, Location, RouteWithTrack } from 'store/route/types';
import { AppState } from 'store/types';
import LocationList from 'ui/components/LocationList';
import SearchBox, { Result } from 'ui/components/SearchBox';
import TspMap from 'ui/components/TspMap';

export interface StateProps {
  distance: string;
  depot: Location | null;
  visits: Location[];
  routes: RouteWithTrack[];
  isDemoLoading: boolean;
  boundingBox: [LatLng, LatLng] | null;
  countryCodeSearchFilter: string[];
}

export interface DispatchProps {
  loadHandler: typeof demoOperations.requestDemo;
  clearHandler: typeof routeOperations.clearRoute;
  addHandler: typeof routeOperations.addLocation;
  removeHandler: typeof routeOperations.deleteLocation;
}

const mapStateToProps = ({ plan, demo, serverInfo }: AppState): StateProps => ({
  distance: plan.distance,
  depot: plan.depot,
  visits: routeSelectors.getVisits(plan),
  routes: plan.routes,
  isDemoLoading: demo.isLoading,
  boundingBox: serverInfo.boundingBox,
  countryCodeSearchFilter: serverInfo.countryCodes,
});

const mapDispatchToProps: DispatchProps = {
  loadHandler: demoOperations.requestDemo,
  clearHandler: routeOperations.clearRoute,
  addHandler: routeOperations.addLocation,
  removeHandler: routeOperations.deleteLocation,
};

export type IDemoProps = DispatchProps & StateProps;

export interface DemoState {
  selectedId: number;
  center: LatLng;
  zoom: number;
}

export class Demo extends React.Component<IDemoProps, DemoState> {
  constructor(props: IDemoProps) {
    super(props);

    this.state = {
      selectedId: NaN,
      center: {
        lat: 50.85,
        lng: 4.35,
      },
      zoom: 9,
    };
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleSearchResultClick = this.handleSearchResultClick.bind(this);
    this.onSelectLocation = this.onSelectLocation.bind(this);
  }

  handleMapClick(e: any) {
    this.props.addHandler(e.latlng);
  }

  handleSearchResultClick(result: Result) {
    this.props.addHandler(result.latLng);
  }

  onSelectLocation(id: number) {
    this.setState({ selectedId: id });
  }

  render() {
    const { selectedId } = this.state;
    const {
      distance,
      depot,
      visits,
      routes,
      isDemoLoading,
      boundingBox,
      countryCodeSearchFilter,
      removeHandler,
      loadHandler,
      clearHandler,
    } = this.props;
    return (
      // FIXME find a way to avoid these style customizations
      <Split gutter="md" style={{ overflowY: 'auto' }}>
        <SplitItem
          isMain={false}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <TextContent>
            <Text component={TextVariants.h1}>Demo</Text>
          </TextContent>
          <SearchBox
            boundingBox={boundingBox}
            countryCodeSearchFilter={countryCodeSearchFilter}
            addHandler={this.handleSearchResultClick}
          />
          <LocationList
            depot={depot}
            visits={visits}
            removeHandler={removeHandler}
            selectHandler={this.onSelectLocation}
          />
        </SplitItem>

        <SplitItem
          isMain={true}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <Split gutter="md">
            <SplitItem isMain={true}>
              <Grid>
                <GridItem span={6}>{`Visits: ${visits.length}`}</GridItem>
                <GridItem span={6}>{`Total travel time: ${distance}`}</GridItem>
              </Grid>
            </SplitItem>
            <SplitItem isMain={false}>
              {routes.length === 0 &&
              <Button
                type="button"
                isDisabled={isDemoLoading}
                style={{ marginBottom: 16 }}
                onClick={loadHandler}
              >
                Load demo
              </Button>
              ||
              <Button
                type="button"
                isDisabled={isDemoLoading}
                style={{ marginBottom: 16 }}
                onClick={clearHandler}
              >
                Clear
              </Button>
              }
            </SplitItem>
          </Split>
          <TspMap
            boundingBox={boundingBox}
            selectedId={selectedId}
            clickHandler={this.handleMapClick}
            removeHandler={removeHandler}
            depot={depot}
            routes={routes}
          />
        </SplitItem>
      </Split>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Demo);
