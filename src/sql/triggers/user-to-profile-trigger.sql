create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
    generated_username text;
begin
    -- 유저네임 생성 시도
    begin
        generated_username := public.generate_random_username();
    exception
        when others then
            raise warning 'Username generation failed for user %: %', new.id, sqlerrm;
            generated_username := 'user_' || substr(md5(new.id::text), 1, 8); -- 폴백
    end;

    -- 프로필 생성
    insert into public.profiles (id, username, avatar_url, role)
    values (
        new.id,
        generated_username,
        (new.raw_user_meta_data->>'avatar_url'),
        'user'
    );
    return new;
exception
    when others then
        raise warning 'Failed to create profile for user %: %', new.id, sqlerrm;
        return new;
end;
$$;

create trigger user_to_profile_trigger
    after insert on auth.users
    for each row execute function public.handle_new_user();