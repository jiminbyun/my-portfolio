// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.Collection;
import java.util.Collections;
import java.util.ArrayList;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    Collection<String> attendees = request.getAttendees();
    ArrayList<TimeRange> possibleMeetingTimes = new ArrayList<>();

    if (request.getDuration() > TimeRange.WHOLE_DAY.duration()) {
      return possibleMeetingTimes;
    } 

    possibleMeetingTimes.add(TimeRange.WHOLE_DAY);

    for (Event event : events) {
      if (!Collections.disjoint(event.getAttendees(), attendees)) {
        TimeRange eventTime = event.getWhen();
        
        int i = 0;
        while (i < possibleMeetingTimes.size()) {
          TimeRange currentTime = possibleMeetingTimes.get(i);
          if (currentTime.overlaps(eventTime)) {
            possibleMeetingTimes.remove(i);

            if (currentTime.start() < eventTime.start()) {
              int duration = eventTime.start() - currentTime.start();
              if (duration >= request.getDuration()) {
                possibleMeetingTimes.add(TimeRange.fromStartDuration(currentTime.start(), duration));
              }
            }

            if (currentTime.end() > eventTime.end()) {
              int duration = currentTime.end() - eventTime.end();
              if (duration >= request.getDuration()) {
                possibleMeetingTimes.add(TimeRange.fromStartDuration(eventTime.end(), duration));
              }
            }
          }
          else {
            i++;
          }
        }
      }
    }
    return possibleMeetingTimes;
  }
}
