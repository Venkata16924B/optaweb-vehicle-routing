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

package org.optaweb.vehiclerouting.plugin.planner.domain;

import java.util.Iterator;
import java.util.NoSuchElementException;

import org.optaweb.vehiclerouting.plugin.planner.domain.persistable.AbstractPersistable;

public class PlanningVehicle extends AbstractPersistable implements Standstill {

    protected int capacity;
    protected PlanningDepot depot;

    // Shadow variables
    private PlanningVisit nextVisit;

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public PlanningDepot getDepot() {
        return depot;
    }

    public void setDepot(PlanningDepot depot) {
        this.depot = depot;
    }

    public PlanningVisit getNextVisit() {
        return nextVisit;
    }

    public void setNextVisit(PlanningVisit nextVisit) {
        this.nextVisit = nextVisit;
    }

    public Iterable<PlanningVisit> getFutureVisits() {
        return () -> new Iterator<PlanningVisit>() {
            PlanningVisit nextVisit = getNextVisit();

            @Override
            public boolean hasNext() {
                return nextVisit != null;
            }

            @Override
            public PlanningVisit next() {
                if (nextVisit == null) {
                    throw new NoSuchElementException();
                }
                PlanningVisit out = nextVisit;
                nextVisit = nextVisit.getNextVisit();
                return out;
            }
        };
    }

    @Override
    public PlanningVehicle getVehicle() {
        return this;
    }

    @Override
    public PlanningLocation getLocation() {
        return depot.getLocation();
    }

    @Override
    public String toString() {
        return "PlanningVehicle{" +
                "capacity=" + capacity +
                (depot == null ? "" : ",depot=" + depot.getId()) +
                (nextVisit == null ? "" : ",nextVisit=" + nextVisit.getId()) +
                ",id=" + id +
                '}';
    }
}
