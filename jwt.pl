#!/usr/bin/perl

# Copyright 2023 Nils Knieling. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

#
# Verify Google Cloud Identity Platform / Firebase JWT tokens using Perl
# https://firebase.google.com/docs/auth/admin/verify-id-tokens
# 

BEGIN {
	$VERSION = "1.0.0";
}

use strict;

# https://metacpan.org/pod/Crypt::JWT
# https://packages.ubuntu.com/jammy/libcrypt-jwt-perl
use Crypt::JWT qw(decode_jwt);

use LWP::UserAgent;
use HTTP::Request::Common;
use JSON::XS;
use Data::Dumper;
use Try::Tiny;

use App::Options (
	option => {
		project => {
			required    => 1,
			default     => 'nkn-it-login-demo-0',
			description => "Google Cloud / Firebase project ID to verify audience (aud)"
		},
	},
);

my $google_project_id = $App::options{project};

print "JWT token: ";
my $jwt_token = <STDIN>;
chomp $jwt_token;

my $ua = LWP::UserAgent->new;

# Get Google public keys
my $google_jwt_keys_url = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
my $request_google_keys = GET "$google_jwt_keys_url";
my $response_google_keys = $ua->request($request_google_keys);
if ($response_google_keys->is_success) {
	my $json_keys = decode_json($response_google_keys->decoded_content);
	# Verify ID token with public keys
	foreach my $key_id (keys %{$json_keys}) {
		my $key = $json_keys->{$key_id};
		print "🔑 $key_id:\n";
		print "$key\n";
		my $data = '';
		try {
			$data = decode_jwt(
				token      => $jwt_token,
				verify_exp => '1',
				verify_iat => '1',
				verify_aud => $google_project_id,
				key        => \$key
			);
		} catch {
			warn "Caught error: $_";
		};
		if ($data && $data->{'sub'} && $data->{'exp'}) {
			print Dumper($data);
			my ($sec, $min, $hour, $mday, $mon, $year, $wday, $yday, $isdst) = localtime($data->{'exp'});
			print "Expiration time: $hour:$min:$sec\n";
			last;
		}
	}
} else {
	die "ERROR: !\nStatus: '". $response_google_keys->status_line ."'\nContent: '" . $response_google_keys->decoded_content ."'\n";
}